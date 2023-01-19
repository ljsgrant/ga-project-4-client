import axios from 'axios';

function App() {
  axios
    .get('/api/birds/')
    .then(({ data }) => {
      console.log(data);
    })
    .catch((err) => console.error(err));

  return <div></div>;
}

export default App;
