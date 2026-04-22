import { collection, onSnapshot, doc, writeBatch } from "firebase/firestore";
import { db } from "../config/firebase";
import { addResume, addResumeInput, deleteResume, getResumes, ResumeInput, updateResume } from "../database/db";

import * as BackgroundTask from 'expo-background-task';
import * as TaskManager from 'expo-task-manager';
import { DeviceEventEmitter } from "react-native";


export function subOnRemoteStore() {
    console.log('creating snapshot')
    return onSnapshot(collection(db, "resumes"), (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const data = change.doc.data();
        switch (change.type){
            case "added":
            case "modified":
                addResume(data);      
                break;
            case "removed":
                deleteResume(+data.id);
                break;
        }
        DeviceEventEmitter.emit('db_updated');
      })});  
}

const BACKGROUND_SYNC_TASK = 'BACKGROUND_RESUME_SYNC';

// Определение задачи
TaskManager.defineTask(BACKGROUND_SYNC_TASK, async () => {
  try {
    const dirtyResumes = await getResumes();

    if (dirtyResumes.length === 0) {
      return BackgroundTask.BackgroundTaskResult.Success;
    }

    const batch = writeBatch(db);
    
    dirtyResumes.forEach((resume) => {
      const docRef = doc(db, "resumes", resume.id.toString());
      batch.set(docRef, { ...resume, lastSync: new Date() }, { merge: true });
    });

    await batch.commit();
    
    return BackgroundTask.BackgroundTaskResult.Success;
  } catch (error) {
    console.error('[Worker] Ошибка синхронизации:', error);
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
});

export async function registerBackgroundSync() {
  return BackgroundTask.registerTaskAsync(BACKGROUND_SYNC_TASK, {
    minimumInterval: 15, // 1 минута (но ОС может изменять этот интервал для экономии заряда)
  });
}