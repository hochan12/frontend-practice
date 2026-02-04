import { useEffect, useState } from "react";

function Styling() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("http://localhost:3000/api/styling")
      .then(res => res.json())
      .then(data => setData(data));
  }, []);

  if (!data) return <p>로딩 중...</p>;

  return (
    <div>
      <h1>{data.title}</h1>
      <ul>
        {data.tips.map((tip: string, index: number) => (
          <li key={index}>{tip}</li>
        ))}
      </ul>
    </div>
  );
}

export default Styling;