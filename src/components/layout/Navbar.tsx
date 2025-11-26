

// type Props = {
//     current: string
//     onChange: (tab: string) => void
// }

// export function Navbar({ current, onChange }: Props) {
//     const tabs : {key: string; label: string}[] = [
//         { key: 'home', label: 'I dag' },
//         { key: 'overview', label: 'Oversigt' },
//         { key: 'mine', label: 'Mine aktiviteter' },
//         { key: 'chat', label: 'Chat' },
//     ]
//     return (
//         <nav className="navbar">
//             {tabs.map(t => (
//                 <button
//                     key={t.key}
//                     className={`nav-btn ${current === t.key ? 'active' : ''}`}
//                     onClick={() => onChange(t.key)}
//                 >
//                     {t.label}
//                 </button>
//             ))}
//         </nav>
//     )
// }