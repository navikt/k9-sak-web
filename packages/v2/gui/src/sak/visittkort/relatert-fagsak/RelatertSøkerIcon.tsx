interface RelatertSøkerIconProps {
  classname?: string;
}

const RelatertSøkerIcon = ({ classname }: RelatertSøkerIconProps) => (
  <svg className={classname} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 165.4 162.59">
    <title>Ukjent kjønn</title>
    <path
      style={{ fill: '#78706a', fillRule: 'evenodd' }}
      // eslint-disable-next-line max-len
      d="M82.7,3.3a78,78,0,1,0,78,78A78,78,0,0,0,82.7,3.3Zm-2,102.22v28.9a5.4,5.4,0,1,1-10.8,0v-28.8H58.14c1.6-5.4,12.4-40.4,12.3-40.4a2.18,2.18,0,0,0-1.5-2.4,2.08,2.08,0,0,0-2.7,1.5L59,87.82a4.49,4.49,0,0,1-5.4,2.4,4.57,4.57,0,0,1-3-5.7s10-31.7,10.1-32c2.7-8.5,9.6-8.5,15.9-8.5h4.1Zm1.7-63.86a9.45,9.45,0,1,1,9.45-9.44A9.44,9.44,0,0,1,82.44,41.66Zm24.5,18.76v26.3a4.22,4.22,0,0,1-8.4,0V64.92a1.79,1.79,0,0,0-1.8-1.8,1.84,1.84,0,0,0-1.8,1.7l-.1.1v69.5a5.4,5.4,0,0,1-10.8.2V44h6c8.1.5,16.9,6.5,16.9,14.7Z"
    />
  </svg>
);

export default RelatertSøkerIcon;
