import React, { useState } from "react";
import { auth, storage, STATE_CHANGED } from "../lib/firebase";
import { Loader } from "../components";

const ImageUploader = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState(null);

  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null || e.target.files.length === 0) {
      console.log("No file selected.");
      return;
    }

    const file = Array.from(e.target.files)[0];
    const extension = file?.type.split("/")[1];

    const ref = storage.ref(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      `uploads/${auth.currentUser.uid}/${Date.now()}.${extension}`
    );
    setUploading(true);

    const task = ref.put(file);
    task.on(STATE_CHANGED, (snapshot) => {
      const percent = (
        (snapshot.bytesTransferred / snapshot.totalBytes) *
        100
      ).toFixed(0);
      setProgress(+percent);

      task
        .then((d) => ref.getDownloadURL())
        .then((url) => {
          setDownloadURL(url);
          setUploading(false);
        });
    });
  };

  return (
    <div className="box">
      <Loader show={uploading} />
      {uploading && <h3>{progress}</h3>}
      {!uploading && (
        <>
          <label className="btn">
            📸 Upload Background Image
            <input type="file" onChange={handleUploadFile} accept="image/*" />
          </label>
        </>
      )}
      {downloadURL && (
        <code className="upload-snippet text-green-500">{`![alt](${downloadURL})`}</code>
      )}
    </div>
  );
};

export default ImageUploader;
