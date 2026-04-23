import { useTheme } from '../../context/ThemeContext'
import styles from './Sidebar.module.css'

// SVG icons defined inline — no icon library needed
function LogoIcon() {
  return (
    <svg width="28" height="26" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.513 0C24.965 2.309 28 6.91 28 12.21 28 19.826 21.732 26 14 26S0 19.826 0 12.21C0 6.91 3.035 2.309 7.487 0L14 12.9z" fill="#7C5DFA"/>
      <path d="M20.513 0L14 12.9 7.487 0A13.974 13.974 0 0114 0c2.23 0 4.336.528 6.513 0z" fill="#fff"/>
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.502 11.342a.703.703 0 00-.807.112 7.763 7.763 0 01-5.275 2.061 7.68 7.68 0 01-7.74-7.74 7.68 7.68 0 012.061-5.274.703.703 0 00-.112-.808A.706.706 0 006.97 0a9.5 9.5 0 00.03 19 9.5 9.5 0 006.423-2.504.703.703 0 00.112-.808z" fill="#858BB2"/>
    </svg>
  )
}

function SunIcon() {
  return (
    <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.994 19.333a.667.667 0 00.667-.667v-1.333a.667.667 0 00-1.333 0v1.333c0 .369.298.667.666.667zM.667 10.667h1.333a.667.667 0 000-1.334H.667a.667.667 0 000 1.334zm18.666-1.334h-1.333a.667.667 0 000 1.334h1.333a.667.667 0 000-1.334zM10 3.333A6.667 6.667 0 1010 16.667 6.667 6.667 0 0010 3.333zm0 12a5.333 5.333 0 110-10.666 5.333 5.333 0 010 10.666zM9.994.667A.667.667 0 0010.661 0V.667a.667.667 0 00-1.334 0V.667c0 .368.299.666.667.666zm6.893 2.44a.667.667 0 00-.943 0l-.943.942a.667.667 0 10.943.943l.943-.942a.667.667 0 000-.943zm-13.78 0a.667.667 0 000 .943l.943.942a.667.667 0 10.942-.943l-.942-.942a.667.667 0 00-.943 0zm13.78 13.78a.667.667 0 00-.943 0l-.943.943a.667.667 0 10.943.942l.943-.942a.667.667 0 000-.943zm-13.78 0a.667.667 0 00-.943.943l.943.942a.667.667 0 10.942-.942l-.942-.943z" fill="#858BB2"/>
    </svg>
  )
}

// function AvatarIcon() {
//   return (
//     <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
//       <circle cx="16" cy="16" r="16" fill="#7C5DFA"/>
//       <path d="M16 17a5 5 0 100-10 5 5 0 000 10zm-8 8a8 8 0 1116 0H8z" fill="#fff"/>
//     </svg>
//   )
// }

export default function Sidebar() {
  const { theme, toggleTheme } = useTheme()

  return (
    <aside className={styles.sidebar} aria-label="Main navigation">
      {/* Logo */}
      <div className={styles.logo} aria-label="Invoice app logo">
        <div className={styles.logoBackground}>
          <LogoIcon />
        </div>
      </div>

      {/* Bottom section — theme toggle + avatar */}
      <div className={styles.bottom}>
        <button
          className={styles.themeToggle}
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <MoonIcon /> : <SunIcon />}
        </button>

        <div className={styles.divider} aria-hidden="true" />

        <div className={styles.avatar} aria-label="User profile">
          <img src="/avatar.jpg" alt="User avatar" width="40" height="40" />
        </div>
      </div>
    </aside>
  )
}
// export default function Sidebar() {
//   return <div>Sidebar</div>
// }