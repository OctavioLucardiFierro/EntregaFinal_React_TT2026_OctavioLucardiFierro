import styled, { css } from "styled-components";

// Atomos visuales reutilizables construidos con styled-components.
// Consumen el tema central (theme.js) via ThemeProvider.

const variantes = {
  primario: css`
    background-color: ${({ theme }) => theme.colors.primary};
    color: #fff;
    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.primaryHover};
    }
  `,
  secundario: css`
    background-color: transparent;
    color: ${({ theme }) => theme.colors.text};
    border: 1px solid ${({ theme }) => theme.colors.border};
    &:hover:not(:disabled) {
      border-color: ${({ theme }) => theme.colors.accent};
      color: ${({ theme }) => theme.colors.accent};
    }
  `,
  peligro: css`
    background-color: ${({ theme }) => theme.colors.danger};
    color: #fff;
    &:hover:not(:disabled) {
      filter: brightness(1.12);
    }
  `,
};

export const Boton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: ${({ theme }) => theme.font};
  font-size: 13px;
  font-weight: 600;
  line-height: 1;
  padding: 10px 20px;
  border: none;
  border-radius: ${({ theme }) => theme.radius};
  cursor: pointer;
  text-decoration: none;
  white-space: nowrap;
  transition: background-color 0.2s, border-color 0.2s, color 0.2s, filter 0.2s;
  ${({ $variante = "primario" }) => variantes[$variante]}

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

export const Etiqueta = styled.span`
  display: inline-block;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accent};
  background-color: rgba(51, 144, 255, 0.1);
  padding: 3px 9px;
  border-radius: 3px;
`;

export const TituloSeccion = styled.h2`
  font-size: clamp(20px, 3vw, 26px);
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

export const TextoApagado = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0;
`;
