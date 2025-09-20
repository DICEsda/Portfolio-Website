# Exam Manager

En React applikation til at administrere eksamener og studerende.

## Funktioner

- Opret eksamener med detaljer (term, kursus, dato, antal spørgsmål, varighed, starttidspunkt)
- Tilføj studerende til eksamener
- Start eksamener med timer og spørgsmålstegning
- Gem noter og karakterer for hver studerende
- Se eksamenshistorik og gennemsnitlige karakterer

## Teknologier

- React 19
- TypeScript
- Tailwind CSS
- Framer Motion (animationer)
- JSON Server (REST API)

## Installation

1. Klon projektet
2. Installer dependencies:
```bash
npm install
```

## Kør applikationen

Du skal køre både React applikationen og JSON Server:

### Terminal 1 - Start JSON Server
```bash
npm run server
```
Dette starter JSON Server på port 3001 med `db.json` som database.

### Terminal 2 - Start React Applikation
```bash
npm run dev
```
Dette starter React applikationen på port 5173.

## API Endpoints

JSON Server tilbyder følgende REST endpoints:

- `GET /exams` - Hent alle eksamener
- `POST /exams` - Opret ny eksamen
- `GET /exams/:id` - Hent specifik eksamen
- `PUT /exams/:id` - Opdater eksamen
- `DELETE /exams/:id` - Slet eksamen

## Datastruktur

```typescript
interface Exam {
  id: string;
  term: string;
  course: string;
  date: string;
  numQuestions: number;
  duration: number;
  startTime: string;
  students: Student[];
  results?: ExamResult[];
}

interface Student {
  name: string;
  studentNumber: string;
}

interface ExamResult {
  studentNumber: string;
  question: string;
  duration: number;
  notes: string;
  grade: string;
}
```

## Fejlfinding

Hvis du får fejl om at serveren ikke kan nås:
1. Sørg for at JSON Server kører (`npm run server`)
2. Tjek at port 3001 ikke er optaget
3. Genstart både server og applikation

## Build

For at bygge til produktion:
```bash
npm run build
```
