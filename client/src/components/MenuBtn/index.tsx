import { useRef } from "react";
import "./main.scss";
export default function MenuBtn({open, onClickFn}: {
    open: boolean,
    onClickFn: any
}) {
  const btnRef = useRef<any>();
  return (
    <div onClick={() => {
      onClickFn(!open)
    }} className={`menu-btn ${open ? "open" : ""}`}>
      <div ref={btnRef} className="menu-btn__burger"></div>
    </div>
  );
}