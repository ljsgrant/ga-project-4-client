import '../../styles/Loading.scss';
import { ThreeDots } from 'react-loader-spinner';

export default function Loading() {
  return (
    <div className='loading-background'>
      <ThreeDots
        height='80'
        width='80'
        radius='9'
        color='#20b2aa'
        ariaLabel='three-dots-loading'
        wrapperStyle={{}}
        wrapperClassName='Loading'
        visible={true}
      />
    </div>
  );
}
