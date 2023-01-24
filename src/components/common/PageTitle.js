import '../../styles/PageTitle.scss';

export default function PageTitle({ titleText, content }) {
  return (
    <>
      <div className='PageTitle'>
        <div>
          <h2>{titleText}</h2>
        </div>
      </div>
      {content}
    </>
  );
}
