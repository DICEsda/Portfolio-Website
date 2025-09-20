import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Switch, Dimensions } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { Audio, AVPlaybackStatusSuccess } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { useKeepAwake } from 'expo-keep-awake';
import { MaterialIcons } from '@expo/vector-icons';

const DURATION_OPTIONS = [5, 10, 15, 20, 30, 45, 60];
const { width } = Dimensions.get('window');

type ImportedAudio = {
  name: string;
  uri: string;
  duration: number;
};

export default function MeditationScreen() {
  useKeepAwake();
  const [importedAudios, setImportedAudios] = useState<ImportedAudio[]>([]);
  const [selectedAudio, setSelectedAudio] = useState<ImportedAudio | null>(null);
  const [audioDuration, setAudioDuration] = useState(0);
  const [timerDuration, setTimerDuration] = useState(10 * 60); // default 10 min
  const [remaining, setRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [vibrate, setVibrate] = useState(true);
  const intervalRef = useRef<number | null>(null);
  const lastVibrateRef = useRef(0);
  const soundRef = useRef<Audio.Sound | null>(null);

  // Load imported audios from local storage on mount
  useEffect(() => {
    (async () => {
      const dir = FileSystem.documentDirectory + 'meditation-audio/';
      const dirInfo = await FileSystem.getInfoAsync(dir);
      if (!dirInfo.exists) await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
      const files = await FileSystem.readDirectoryAsync(dir);
      const audioList: ImportedAudio[] = await Promise.all(files.map(async (file) => {
        const uri = dir + file;
        let duration = 0;
        try {
          const { sound, status } = await Audio.Sound.createAsync({ uri }, {}, undefined, false);
          if ((status as AVPlaybackStatusSuccess).isLoaded) {
            duration = (status as AVPlaybackStatusSuccess).durationMillis ?? 0;
          }
          await sound.unloadAsync();
        } catch (e) {
          // ignore
        }
        return { name: file, uri, duration };
      }));
      setImportedAudios(audioList);
    })();
  }, []);

  // Timer logic
  useEffect(() => {
    if (isRunning && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining((r) => {
          const next = r - 1;
          if (vibrate && next > 0 && next % 30 === 0 && next !== lastVibrateRef.current) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            lastVibrateRef.current = next;
          }
          if (next <= 0) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setIsRunning(false);
            saveSession(timerDuration);
            stopAudio();
          }
          return next;
        });
      }, 1000) as number;
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, vibrate]);

  // Play selected audio
  const playAudio = async () => {
    if (!selectedAudio) return;
    if (soundRef.current) await soundRef.current.unloadAsync();
    const { sound } = await Audio.Sound.createAsync({ uri: selectedAudio.uri });
    soundRef.current = sound;
    await sound.playAsync();
  };

  const stopAudio = async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
  };

  // Import audio file
  const importAudio = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: 'audio/*' });
    if (result && 'type' in result && result.type === 'success' && 'name' in result && 'uri' in result) {
      const dir = FileSystem.documentDirectory + 'meditation-audio/';
      const dest = dir + (result.name as string);
      await FileSystem.copyAsync({ from: result.uri, to: dest });
      setImportedAudios((prev) => [...prev, { name: result.name as string, uri: dest, duration: 0 }]);
    }
  };

  // Save session to backend (stub)
  const saveSession = async (duration: number) => {
    // TODO: Implement backend call to save meditation session
    // await fetch('YOUR_BACKEND_ENDPOINT', { method: 'POST', body: JSON.stringify({ duration }) });
  };

  // Start timer
  const startTimer = () => {
    setRemaining(timerDuration);
    setIsRunning(true);
    playAudio();
    lastVibrateRef.current = timerDuration;
  };

  // Stop timer
  const stopTimer = () => {
    setIsRunning(false);
    stopAudio();
  };

  // Reset timer
  const resetTimer = () => {
    setIsRunning(false);
    setRemaining(timerDuration);
    stopAudio();
  };

  // Format seconds to mm:ss
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // UI
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meditation</Text>
      <Text style={styles.subtitle}>Import your own meditation audio and track your sessions</Text>
      <TouchableOpacity style={styles.importBtn} onPress={importAudio}>
        <MaterialIcons name="file-upload" size={24} color="#fff" />
        <Text style={styles.importBtnText}>Import Audio</Text>
      </TouchableOpacity>
      <FlatList
        data={importedAudios}
        keyExtractor={(item) => item.uri}
        horizontal
        style={{ marginVertical: 16, maxHeight: 80 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.audioItem, selectedAudio?.uri === item.uri && styles.audioItemSelected]}
            onPress={() => setSelectedAudio(item)}
          >
            <MaterialIcons name="music-note" size={24} color="#333" />
            <Text style={styles.audioTitle}>{item.name}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={{ color: '#888', fontSize: 14 }}>No audio files imported</Text>}
      />
      <View style={styles.dialRow}>
        {DURATION_OPTIONS.map((min) => (
          <TouchableOpacity
            key={min}
            style={[styles.dialBtn, timerDuration === min * 60 && styles.dialBtnSelected]}
            onPress={() => setTimerDuration(min * 60)}
            disabled={isRunning}
          >
            <Text style={styles.dialBtnText}>{min}m</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.timerBox}>
        <Text style={styles.timerText}>{formatTime(remaining > 0 ? remaining : timerDuration)}</Text>
      </View>
      <View style={styles.controlsRow}>
        <TouchableOpacity style={styles.controlBtn} onPress={startTimer} disabled={isRunning || !selectedAudio}>
          <MaterialIcons name="play-arrow" size={32} color={isRunning || !selectedAudio ? '#bbb' : '#4caf50'} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlBtn} onPress={stopTimer} disabled={!isRunning}>
          <MaterialIcons name="pause" size={32} color={!isRunning ? '#bbb' : '#f44336'} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlBtn} onPress={resetTimer}>
          <MaterialIcons name="replay" size={32} color="#2196f3" />
        </TouchableOpacity>
      </View>
      <View style={styles.vibrateRow}>
        <Text style={styles.vibrateLabel}>Vibrate every 30s</Text>
        <Switch value={vibrate} onValueChange={setVibrate} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 8,
    color: '#222',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: 16,
    color: '#444',
  },
  importBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4caf50',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  importBtnText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 16,
  },
  audioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 10,
  },
  audioItemSelected: {
    backgroundColor: '#b2dfdb',
  },
  audioTitle: {
    marginLeft: 6,
    fontSize: 15,
    color: '#333',
    maxWidth: width * 0.3,
  },
  dialRow: {
    flexDirection: 'row',
    marginVertical: 12,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  dialBtn: {
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginHorizontal: 4,
    marginVertical: 4,
  },
  dialBtnSelected: {
    backgroundColor: '#4caf50',
  },
  dialBtnText: {
    color: '#222',
    fontWeight: '600',
    fontSize: 15,
  },
  timerBox: {
    marginVertical: 18,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 36,
    paddingVertical: 18,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  timerText: {
    fontSize: 44,
    fontWeight: 'bold',
    color: '#222',
    letterSpacing: 2,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  controlBtn: {
    marginHorizontal: 16,
    padding: 8,
  },
  vibrateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
  },
  vibrateLabel: {
    fontSize: 16,
    color: '#444',
    marginRight: 8,
  },
}); 