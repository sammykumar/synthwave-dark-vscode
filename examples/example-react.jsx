/**
 * SynthWave Dark Theme - React JSX Showcase
 *
 * This file demonstrates React/JSX syntax highlighting features
 * of the SynthWave Dark VS Code theme.
 *
 * Author: Sammy Kumar
 * Theme: SynthWave Dark
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

// ===== THEME CONSTANTS =====
const THEME_COLORS = {
  neonPink: '#f92672',
  neonCyan: '#66d9ef', 
  neonYellow: '#e6db74',
  neonPurple: '#ae81ff',
  neonGreen: '#4ade80'
};

const GLOW_STYLES = {
  textShadow: `
    0 0 10px ${THEME_COLORS.neonPink}80,
    0 0 20px ${THEME_COLORS.neonPink}60,
    0 0 30px ${THEME_COLORS.neonPink}40
  `
};

// ===== FUNCTIONAL COMPONENT =====
const SynthWaveButton = ({ 
  children, 
  color = 'neonPink', 
  glowEffect = true, 
  onClick,
  disabled = false 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const buttonStyle = useMemo(() => ({
    background: `linear-gradient(45deg, ${THEME_COLORS[color]}, #000)`,
    color: '#fff',
    border: `2px solid ${THEME_COLORS[color]}`,
    padding: '12px 24px',
    borderRadius: '8px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s ease',
    textShadow: glowEffect && isHovered ? GLOW_STYLES.textShadow : 'none',
    opacity: disabled ? 0.6 : 1,
    transform: isHovered && !disabled ? 'scale(1.05)' : 'scale(1)'
  }), [color, glowEffect, isHovered, disabled]);

  const handleClick = useCallback((e) => {
    if (!disabled) {
      setClickCount(prev => prev + 1);
      onClick?.(e);
    }
  }, [disabled, onClick]);

  return (
    <button
      style={buttonStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      disabled={disabled}
      aria-label={`SynthWave button clicked ${clickCount} times`}
    >
      {children}
      {clickCount > 0 && <span className="click-count"> ({clickCount})</span>}
    </button>
  );
};

// ===== PROP TYPES =====
SynthWaveButton.propTypes = {
  children: PropTypes.node.isRequired,
  color: PropTypes.oneOf(Object.keys(THEME_COLORS)),
  glowEffect: PropTypes.bool,
  onClick: PropTypes.func,
  disabled: PropTypes.bool
};

// ===== CLASS COMPONENT =====
class ThemeControlPanel extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      currentTheme: 'synthwave',
      glowEnabled: false,
      intensity: 50,
      selectedColors: [],
      isLoading: false
    };

    // Bind methods
    this.toggleGlow = this.toggleGlow.bind(this);
    this.handleIntensityChange = this.handleIntensityChange.bind(this);
  }

  componentDidMount() {
    console.log('🌈 Theme Control Panel mounted');
    this.loadThemeSettings();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.glowEnabled !== this.state.glowEnabled) {
      console.log(`Glow effect ${this.state.glowEnabled ? 'enabled' : 'disabled'}`);
    }
  }

  componentWillUnmount() {
    console.log('Theme Control Panel unmounting...');
  }

  async loadThemeSettings() {
    this.setState({ isLoading: true });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.setState({
        glowEnabled: true,
        intensity: 75,
        selectedColors: ['neonPink', 'neonCyan']
      });
    } catch (error) {
      console.error('Failed to load theme settings:', error);
    } finally {
      this.setState({ isLoading: false });
    }
  }

  toggleGlow() {
    this.setState(prevState => ({
      glowEnabled: !prevState.glowEnabled
    }));
  }

  handleIntensityChange(event) {
    const intensity = parseInt(event.target.value, 10);
    this.setState({ intensity });
  }

  render() {
    const { glowEnabled, intensity, selectedColors, isLoading } = this.state;

    if (isLoading) {
      return (
        <div className="loading-spinner" style={{ 
          color: THEME_COLORS.neonCyan,
          textAlign: 'center',
          padding: '20px'
        }}>
          ⚡ Loading SynthWave settings...
        </div>
      );
    }

    return (
      <div className="theme-control-panel" style={{
        background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
        padding: '20px',
        borderRadius: '12px',
        border: `1px solid ${THEME_COLORS.neonPurple}40`
      }}>
        <h2 style={{ color: THEME_COLORS.neonPink }}>
          🎛️ SynthWave Controls
        </h2>
        
        <div className="controls">
          <label style={{ color: THEME_COLORS.neonCyan }}>
            <input
              type="checkbox"
              checked={glowEnabled}
              onChange={this.toggleGlow}
            />
            Enable Neon Glow
          </label>
          
          <div className="intensity-control">
            <label style={{ color: THEME_COLORS.neonYellow }}>
              Glow Intensity: {intensity}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={intensity}
              onChange={this.handleIntensityChange}
              disabled={!glowEnabled}
            />
          </div>
          
          <div className="color-selection">
            {Object.entries(THEME_COLORS).map(([colorName, colorValue]) => (
              <div key={colorName} className="color-option">
                <input
                  type="checkbox"
                  id={colorName}
                  checked={selectedColors.includes(colorName)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      this.setState(prev => ({
                        selectedColors: [...prev.selectedColors, colorName]
                      }));
                    } else {
                      this.setState(prev => ({
                        selectedColors: prev.selectedColors.filter(c => c !== colorName)
                      }));
                    }
                  }}
                />
                <label 
                  htmlFor={colorName}
                  style={{ 
                    color: colorValue,
                    marginLeft: '8px'
                  }}
                >
                  {colorName}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

// ===== HOOKS SHOWCASE =====
const useThemeGlow = (initialGlow = false) => {
  const [glowEnabled, setGlowEnabled] = useState(initialGlow);
  const [glowIntensity, setGlowIntensity] = useState(50);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'g' && event.ctrlKey) {
        setGlowEnabled(prev => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  const toggleGlow = useCallback(() => {
    setGlowEnabled(prev => !prev);
  }, []);

  return {
    glowEnabled,
    glowIntensity,
    setGlowIntensity,
    toggleGlow
  };
};

// ===== MAIN APP COMPONENT =====
const SynthWaveApp = () => {
  const { glowEnabled, glowIntensity, toggleGlow } = useThemeGlow(true);
  const [theme, setTheme] = useState('dark');
  
  const appStyle = useMemo(() => ({
    minHeight: '100vh',
    background: `
      linear-gradient(45deg, 
        rgba(249, 38, 114, 0.1) 0%,
        rgba(102, 217, 239, 0.1) 25%,
        rgba(230, 219, 116, 0.1) 50%,
        rgba(174, 129, 255, 0.1) 75%,
        rgba(74, 222, 128, 0.1) 100%
      ),
      #0f0f0f
    `,
    padding: '20px',
    fontFamily: '"Fira Code", "Consolas", monospace'
  }), []);

  return (
    <div style={appStyle}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ 
          color: THEME_COLORS.neonPink,
          fontSize: '3rem',
          textShadow: glowEnabled ? GLOW_STYLES.textShadow : 'none'
        }}>
          🌈 SynthWave Dark
        </h1>
        <p style={{ color: THEME_COLORS.neonCyan }}>
          A retro-futuristic theme for modern developers
        </p>
      </header>

      <main>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px' 
        }}>
          <ThemeControlPanel />
          
          <div className="button-showcase" style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '20px',
            borderRadius: '12px'
          }}>
            <h3 style={{ color: THEME_COLORS.neonYellow }}>
              🎮 Interactive Elements
            </h3>
            
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '15px' 
            }}>
              {Object.keys(THEME_COLORS).map(color => (
                <SynthWaveButton
                  key={color}
                  color={color}
                  glowEffect={glowEnabled}
                  onClick={() => console.log(`${color} button clicked!`)}
                >
                  {color.replace('neon', '')} Glow
                </SynthWaveButton>
              ))}
              
              <SynthWaveButton
                color="neonPurple"
                disabled
                glowEffect={glowEnabled}
              >
                Disabled Button
              </SynthWaveButton>
            </div>
          </div>
        </div>
      </main>

      <footer style={{ 
        marginTop: '40px', 
        textAlign: 'center',
        color: THEME_COLORS.neonGreen
      }}>
        <p>⚡ Powered by SynthWave Dark Theme ⚡</p>
      </footer>
    </div>
  );
};

// ===== HIGHER ORDER COMPONENT =====
const withTheme = (WrappedComponent) => {
  return function ThemedComponent(props) {
    const themeContext = {
      colors: THEME_COLORS,
      glowStyles: GLOW_STYLES
    };

    return (
      <div className="themed-wrapper">
        <WrappedComponent {...props} theme={themeContext} />
      </div>
    );
  };
};

// ===== RENDER PROPS COMPONENT =====
const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('synthwave');
  
  return children({
    theme: currentTheme,
    setTheme: setCurrentTheme,
    colors: THEME_COLORS
  });
};

// ===== EXPORT STATEMENT =====
export default SynthWaveApp;
export { 
  SynthWaveButton, 
  ThemeControlPanel, 
  useThemeGlow, 
  withTheme, 
  ThemeProvider,
  THEME_COLORS 
};