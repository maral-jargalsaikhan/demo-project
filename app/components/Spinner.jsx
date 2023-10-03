import { Spin } from "antd";

export default function Spinner() {
  return (
    <div className="w-full h-[600px] flex justify-center items-center">
      <Spin spinning />
    </div>
  );
}
