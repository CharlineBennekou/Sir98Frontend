import '../../styles/DropUpMenuStyle.css'
import { LuCopyPlus, LuSquarePlus, LuX, LuSquareX } from "react-icons/lu";


type DropUpMenuProps = {
    open: boolean;
    onClose: () => void;
    onFollowSingle: () => void;
    onFollowAll: () => void;
    onUnfollow: () => void;
    isSubscribed: boolean;
    activityTitle: string;
};


export default function DropUpMenu({
    open,
    onClose,
    onFollowSingle,
    onFollowAll,
    onUnfollow,
    isSubscribed,
    activityTitle
}: DropUpMenuProps) {

    if (!open) return null;

    return (
        <>
            {/* Overlay */}
            <div className="dropup-overlay" onClick={onClose} />

            {/* Menu */}
            <div className="dropup-menu">
                {!isSubscribed && (
                    <>
                        <button className="dropup-item" onClick={() => { onFollowSingle(); onClose(); }}>
                            <span className="icon-wrapper"><LuSquarePlus /></span>
                             Følg denne {activityTitle} aktivitet
                        </button>

                        <button className="dropup-item" onClick={() => { onFollowAll(); onClose(); }}>
                            <span className="icon-wrapper"><LuCopyPlus /></span>
                            Følg alle {activityTitle} aktiviteter
                        </button>

                        <button className="dropup-item danger" onClick={onClose}>
                            <span className="icon-wrapper"><LuX /></span>
                            Fortryd
                        </button>
                   </>
                )}
                {isSubscribed && (
                    <>
                        <button className="dropup-item danger" onClick={() => { onUnfollow(); onClose(); }}>
                            <span className="icon-wrapper"><LuSquareX /></span>
                            Følg ikke længere
                        </button>
                    </>
                )}
            </div>
        </>
    );
}
