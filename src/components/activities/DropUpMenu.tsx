import '../../styles/DropUpMenuStyle.css'


type DropUpMenuProps = {
    open: boolean;
    onClose: () => void;
    onFollowSingle: () => void;
    onFollowAll: () => void;
    onUnfollow: () => void;
    isSubscribed: boolean;

};

export default function DropUpMenu({
    open,
    onClose,
    onFollowSingle,
    onFollowAll,
    onUnfollow,
    isSubscribed
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
                            Følg enkelte aktivitet
                        </button>

                        <button className="dropup-item" onClick={() => { onFollowAll(); onClose(); }}>
                            Følg alle aktiviteterne
                        </button>

                        <button className="dropup-item danger" onClick= { onClose }>
                            Fortryd
                        </button>
                   </>
                )}
                {isSubscribed && (
                    <>
                        <button className="dropup-item" onClick={() => { onUnfollow(); onClose(); }}>
                            Følg ikke længere
                        </button>
                    </>
                )}
            </div>
        </>
    );
}
