import CreateExam from '../pages/CreateExam';
import AddStudents from '../pages/AddStudents';
import StartExam from '../pages/StartExam';
import History from '../pages/History';
import { Navigate } from 'react-router-dom';

const routes = [
  { path: '/', element: <CreateExam /> },
  { path: '/add-students', element: <AddStudents /> },
  { path: '/start-exam', element: <StartExam /> },
  { path: '/history', element: <History /> },
  { path: '*', element: <Navigate to="/" /> },
];

export default routes; 