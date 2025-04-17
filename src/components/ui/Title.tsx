function Title({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-10 w-3 bg-indigo-600 rounded-full"></div>
      <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
        {title}
      </h2>
    </div>
  );
}

export default Title;
