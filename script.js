// ✅ Firebase Configuration (replace with your actual config)
const firebaseConfig = {
  apiKey: "",
  authDomain: "photo-and-video-websites.firebaseapp.com",
  projectId: "photo-and-video-websites",
  storageBucket: "photo-and-video-websites.appspot.com", // corrected
  messagingSenderId: "725570702970",
  appId: "1:725570702970:web:7b44ff62caae9aab0b35c3",
  measurementId: "G-MKGZ4CE21K"
};

// ✅ Initialize Firebase
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
const db = firebase.firestore();

// ✅ Handle Upload Button
document.getElementById("uploadBtn").addEventListener("click", () => {
  document.getElementById("fileInput").click();
});

// ✅ Handle File Upload
document.getElementById("fileInput").addEventListener("change", function () {
  const file = this.files[0];
  if (!file) return;

  const storageRef = storage.ref("uploads/" + file.name);
  storageRef.put(file).then(snapshot => snapshot.ref.getDownloadURL())
    .then(url => db.collection("images").add({ url }))
    .then(() => {
      alert("Upload successful!");
      loadImages();
    })
    .catch(error => {
      console.error("Error uploading:", error);
      alert("Upload failed.");
    });
});

function loadImages() {
  const grid = document.querySelector(".image-grid");

  // ❗️ Remove only images added from Firebase (not hardcoded ones)
  const existingFirebaseImgs = grid.querySelectorAll(".firebase-img");
  existingFirebaseImgs.forEach(img => img.remove());

  // 🔄 Load images from Firestore and append them
  db.collection("images").get().then(snapshot => {
    snapshot.forEach(doc => {
      const img = document.createElement("img");
      img.src = doc.data().url;
      img.classList.add("firebase-img"); // mark as Firebase image
      img.style.width = "100%";
      img.style.height = "300px";
      img.style.objectFit = "cover";
      img.style.borderRadius = "10px";
      grid.appendChild(img);
    });
  });
}

