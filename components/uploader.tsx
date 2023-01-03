import React, { useState } from "react";
import MusicDatase from "../lib/music_database";

type UploaderProps = {
  onFileUploaded: Function;
};

const Uploader = (props: UploaderProps) => {
  const fileInput = React.createRef<HTMLInputElement>();
  const db = new MusicDatase();
  const [text, setText] = useState("Upload a file");

  function handleChange(event: React.ChangeEvent) {
    event.preventDefault();
    setText("Uploading...");

    const files = fileInput.current?.files || [];
    for (let i = 0; i < files?.length; i++) {
      const file = files[i];
      db.transaction("rw", db.musics, async () => {
        const name = file?.name;
        if ((await db.musics.where({ name: name }).count()) === 0) {
          const id = await db.musics.add({
            name: name,
            file: file,
            importedAt: new Date(),
          });
        }
      }).catch((e) => {
        alert(e.stack || e);
      });
    }
    setText("Upload a file");
    props.onFileUploaded();
  }

  return (
    <section className="flex items-center justify-center bg-grey-lighter">
      <label className="w-64 flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue hover:text-blue">
        <span className="mt-2 text-base leading-normal">{text}</span>
        <input
          type="file"
          className="hidden"
          accept="audio/*"
          ref={fileInput}
          multiple={true}
          onChange={handleChange}
        />
      </label>
    </section>
  );
};

export default Uploader;
