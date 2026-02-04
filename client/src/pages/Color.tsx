import { useEffect, useState } from "react";

function Color() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("http://localhost:3000/api/color")
      .then(res => res.json())
      .then(data => setData(data));
  }, []);

  if (!data) return <p>로딩 중...</p>;

  return (
    <div>
      <h1>{data.title}</h1>
      <h2>{data.color}</h2>
      <p>{data.description}</p>
    </div>
  );
}

export default Color;