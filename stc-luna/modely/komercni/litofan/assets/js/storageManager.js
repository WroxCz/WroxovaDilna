// ==========================================
// Firebase Storage Manager
// ==========================================

import { storage } from "../../../../../../firebase/firebase.js";

import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject
}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-storage.js";

/* ==========================================
   Upload fotografie
========================================== */

export async function uploadPhoto(file, projectId) {

    const extension =
        file.name.split(".").pop();

    const fileName =
        `${crypto.randomUUID()}.${extension}`;

    const path =
        `litofan/temp/${projectId}/${fileName}`;

    const storageRef =
        ref(storage, path);

    await uploadBytes(storageRef, file);

    const url =
        await getDownloadURL(storageRef);

    return {

        path,
        url,
        fileName

    };

}

/* ==========================================
   Smazání fotografie
========================================== */

export async function deletePhoto(path) {

    if (!path) return;

    const storageRef =
        ref(storage, path);

    await deleteObject(storageRef);

}