import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import './main.scss'

const Index: React.FC = () => <div className='btn_load'>
    <Spin indicator={<LoadingOutlined style={{ fontSize: 60 }} spin />} />
</div>;

export default Index;