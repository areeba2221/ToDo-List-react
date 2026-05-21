const Video = () => {
    return (
         <video
      autoPlay
      muted
      loop
      className="fixed right-0 bottom-0 min-w-full min-h-full object-cover z-0">

      <source
        src="/ChillhopWhiteOak.mp4"
        type="video/mp4"/>

    </video>
    );
}
 
export default Video;