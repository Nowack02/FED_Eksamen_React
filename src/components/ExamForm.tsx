// src/components/ExamForm.tsx

import React, { useState } from 'react';
import { Exam } from '../types';
// 1. Importer CSS modulet
import styles from './ExamForm.module.css';

interface ExamFormProps {
    onSave: (exam: Omit<Exam, 'id'>) => void;
    isSaving: boolean;
}

export const ExamForm: React.FC<ExamFormProps> = ({ onSave, isSaving }) => {
    // ... din useState og handleChange logik er uændret ...
    const [formData, setFormData] = useState({
        examtermin: '',
        courseName: '',
        date: '',
        numberOfQuestions: 10,
        examDurationMinutes: 20,
        startTime: '09:00',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseInt(value, 10) : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            {/* Disse to felter forbliver i fuld bredde */}
            <div className={styles.formGroup}>
                <label htmlFor="examtermin">Eksamenstermin:</label>
                <input id="examtermin" type="text" name="examtermin" value={formData.examtermin} onChange={handleChange} required disabled={isSaving}/>
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="courseName">Kursusnavn:</label>
                <input id="courseName" type="text" name="courseName" value={formData.courseName} onChange={handleChange} required disabled={isSaving}/>
            </div>

            {/* NY GRUPPERING: En 'div' til at holde de fire felter */}
            <div className={styles.gridRow}>
                <div className={styles.formGroup}>
                    <label htmlFor="date">Dato:</label>
                    <input id="date" type="date" name="date" value={formData.date} onChange={handleChange} required disabled={isSaving}/>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="numberOfQuestions">Antal Spørgsmål:</label>
                    <input id="numberOfQuestions" type="number" name="numberOfQuestions" value={formData.numberOfQuestions} onChange={handleChange} min="1" required disabled={isSaving}/>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="examDurationMinutes">Eksaminationstid (min):</label>
                    <input id="examDurationMinutes" type="number" name="examDurationMinutes" value={formData.examDurationMinutes} onChange={handleChange} min="1" required disabled={isSaving}/>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="startTime">Starttidspunkt:</label>
                    <input id="startTime" type="time" name="startTime" value={formData.startTime} onChange={handleChange} required disabled={isSaving}/>
                </div>
            </div>
            
            <button type="submit" className={styles.button} disabled={isSaving}>
                {isSaving ? 'Gemmer...' : 'Opret Eksamen'}
            </button>
        </form>
    );
};