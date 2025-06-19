import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Exam } from '../types';
import { getExams } from '../api/api';
import { ExamTable } from '../components/ExamTable';
import styles from './Home.module.css';

export default function Home() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const allExams = await getExams();
        const ongoingExams = allExams.filter(exam => !exam.isCompleted);
        setExams(ongoingExams);
      } catch (err) {
        setError('Kunne ikke hente eksamener.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchExams();
  }, []);

  if (isLoading) return <p>Indlæser igangværende eksamener...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <div className={styles.pageHeader}>
        <h2>Igangværende Eksamener</h2>
      </div>
      
      {exams.length === 0 ? (
        <p>Der er ingen igangværende eksamener. <Link to="/create-exam">Opret en ny</Link> eller se <Link to="/history">historikken</Link>.</p>
      ) : (
        <ExamTable
          exams={exams}
          renderActions={(exam) => (
            <>
              <Link to={`/exam/${exam.id}/add-students`} className={`${styles.button} ${styles.buttonSecondary} ${styles.buttonSmall}`}>
                Administrer
              </Link>
              <Link to={`/exam/${exam.id}/session`} className={`${styles.button} ${styles.buttonPrimary} ${styles.buttonSmall}`}>
                Start/Fortsæt
              </Link>
            </>
          )}
        />
      )}
    </div>
  );
}