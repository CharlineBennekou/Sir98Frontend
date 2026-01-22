import '../../styles/DropUpMenuStyle.css';
import { LuCalendarRange, LuCalendarCheck, LuX } from "react-icons/lu";

type UpdateDropUpMenuProps = {
  open: boolean;
  onClose: () => void;
  onUpdateAll: () => void;
  onUpdateSingle: () => void;
  isRecurring: boolean;
};

export default function UpdateDropUpMenu({
  open,
  onClose,
  onUpdateAll,
  onUpdateSingle,
  isRecurring
}: UpdateDropUpMenuProps) {

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div className="dropup-overlay" onClick={onClose} />

      {/* Menu */}
      <div className="dropup-menu">
        {isRecurring && (
        <button
          className="dropup-item"
          onClick={() => {
            onUpdateAll();
            onClose();
          }}
        >
          <span className="icon-wrapper"><LuCalendarRange /></span>
          Opdater hele serien
        </button>
        )}

        <button
          className="dropup-item"
          onClick={() => {
            onUpdateSingle();
            onClose();
          }}
        >
          <span className="icon-wrapper"><LuCalendarCheck /></span>
          Opdater den enkelte aktivitet
        </button>

        <button className="dropup-item danger" onClick={onClose}>
          <span className="icon-wrapper"><LuX /></span>
          Fortryd
        </button>
      </div>
    </>
  );
}
