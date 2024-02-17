import { Spin } from 'antd';

const LoadingSpinner = () => {
  return (
    <div
      style={{
        fontSize: 20,
        paddingTop: 20,
        textAlign: 'center',
      }}
    >
      Загрузка <Spin />
    </div>
  );
};

export default LoadingSpinner;
