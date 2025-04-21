const Loading = () => {
  return (
    <div className="fixed top-0 left-0 z-50 h-screen w-full bg-[#000000e8] flex items-center justify-center">
      <div className="text-5xl w-fit animate-pulse">🕰️</div>
    </div>
  );
};

export default Loading;
