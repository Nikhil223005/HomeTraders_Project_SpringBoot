import { useEffect, useState } from 'react';
import { getProperties } from '../Api/api';

function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getProperties().then(res => setData(res.data));
  }, []);

  return <div>{data.map(p => <p key={p.id}>{p.title}</p>)}</div>
}

export default Home;