import React from "react";
import MusicDatase from "../lib/music_database";

type UploaderProps = {
  onFileUploaded: Function;
};

const Uploader = (props: UploaderProps) => {
  const fileInput = React.createRef<HTMLInputElement>();
  const db = new MusicDatase();

  function handleChange(event: any) {
    event.preventDefault();

    Array.from((fileInput as any).current.files).forEach((file: any) => {
      db.transaction("rw", db.musics, async () => {
        const name = file?.name;
        if ((await db.musics.where({ name: name }).count()) === 0) {
          const id = await db.musics.add({ name: name, file: file });
        }
      }).catch((e) => {
        alert(e.stack || e);
      });
    });
    props.onFileUploaded();
  }

  return (
    <section className="flex items-center justify-center bg-grey-lighter">
      <label className="w-64 flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue hover:text-blue">
        <span className="mt-2 text-base leading-normal">Upload a file</span>
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
