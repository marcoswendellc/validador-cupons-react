import styled from "styled-components";
import buritiImage from "../../assets/BURITI-101.jpg";

export const BackgroundImage = styled.div`
  background: url(${buritiImage}) no-repeat;
  background-size: cover;
  width: 100vw;
  height: 100vh;
  background-position: center;
  position: absolute;
  inset: 0;
  z-index: -1;

  filter: brightness(0.4);
`;

export const Background = styled.div`
  background-color: transparent;
  padding: 20px;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;

  form {
    width: 50vw;
    height: 300px;
    max-width: 480px;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    gap: 20px;

    margin-top: 20px;
    padding: 20px;

    background-color: rgba(0, 0, 0, 0.6);
    /* filter: blur(5px); */
    backdrop-filter: blur(5px);
    box-shadow: 0 0 10px white;
    border-radius: 20px;
  }

  .input-container {
    width: 80%;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  input,
  button {
    border-radius: 10px;
    border: 1px solid rgb(184, 184, 184);
    padding: 8px 12px;
    outline: none;
  }

  input {
    height: 40px;
    background-color: rgba(255, 243, 210, 1);
  }

  .input-error {
    border: 2px solid red;
  }

  button {
    width: 150px;
    height: 40px;
    border-radius: 20px;
    border: none;
    background-color: rgba(0, 94, 255, 0.898);
    color: white;

    &:hover {
      transform: translateY(-3px);
      transition: all 0.3s ease-in-out;
    }
  }

  .inputs {
    display: flex;
    flex-direction: column;
    width: 80%;
    max-width: 300px;
    gap: 16px;
  }

  .input-container input {
    width: 100%;
    height: 40px;
    background-color: white;
    padding-right: 40px;
    color: black;
  }

  .title {
    width: 100%;
    height: 40px;

    p {
      font-size: 16px;
      font-weight: bold;
      font-family: "Poppins", sans-serif;
      color: red;
    }
  }

  i {
    font-size: 24px;
    position: absolute;
    right: 12px;
    color: #666;
    pointer-events: none;
  }

  @media (max-width: 780px) {
    form {
      width: 90vw;
      padding: 10px;
    }
  }
`;
