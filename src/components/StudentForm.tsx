import React, { useState } from 'react';
import styles from './StudentForm.module.css';

interface StudentFormProps {
    onSave: (name: string, studentNo: string) => void;
    isSaving: boolean;
}

export const StudentForm: React.FC<StudentFormProps> = ({ onSave, isSaving }) => {
    const [name, setName] = useState('');
    const [studentNo, setStudentNo] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !studentNo) {
            alert('Udfyld venligst både navn og studienummer.');
            return;
        }
        onSave(name, studentNo);
        setName('');
        setStudentNo('');
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <h3>Tilføj Studerende</h3>
            <div className={styles.formGroup}>
                <label htmlFor="studentName">Navn:</label>
                <input
                    id="studentName"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Fulde navn"
                    required
                    disabled={isSaving}
                />
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="studentNo">Studienummer:</label>
                <input
                    id="studentNo"
                    type="text"
                    value={studentNo}
                    onChange={(e) => setStudentNo(e.target.value)}
                    placeholder="f.eks. 123456"
                    required
                    disabled={isSaving}
                />
            </div>
            <button type="submit" className={styles.button} disabled={isSaving}>
                {isSaving ? 'Tilføjer...' : 'Tilføj Studerende'}
            </button>
        </form>
    );
};