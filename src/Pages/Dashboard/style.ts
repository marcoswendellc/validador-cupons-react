import styled from "styled-components";
import buritiImage from "../../assets/buriti03.webp";

export const Background = styled.div`
  height: 100vh;
  width: 100%;
  /* min-width: 500px; */
  overflow-x: auto;
  overflow-y: hidden;
  display: flex;
  justify-content: center;
  align-items: center;

  &::before {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url(${buritiImage}) no-repeat;
    background-size: cover;
    background-position: center;
    filter: brightness(0.3);
    z-index: -1;
  }

  .dashboard {
    display: flex;
    height: inherit;
    padding: 20px;
    position: relative;
    width: 100%;
    max-width: 1920px;
    min-width: 500px;
    margin: 0 auto;
    background-color: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(5px);
    box-sizing: border-box;
    flex-shrink: 0;

    &__aside {
      background-color: #212429;
      border: 1px solid rgba(255, 255, 255, 0.2);
      padding: 16px;
      height: 100%;
      width: 15%;
      min-width: 250px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      gap: 150px;
      /* position: relative; 
      z-index: 1; */
    }

    &__user {
      font-weight: bold;
      text-align: center;
      font-size: 1.2rem;
    }

    &__content {
      width: 85%;
      background-color: white;
      border-radius: 8px;
      color: black;
      height: 100%;
      margin: 0 auto;

      &-header {
        padding: 16px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
      }
      &-body {
        padding: 16px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
        height: 90%;
      }
    }

    &__form {
      display: flex;
      gap: 16px;
      width: 100%;
      max-width: 700px;
    }

    &__input {
      width: 80%;
      max-width: 700px;
      height: 40px;
      border: none;
      border-radius: 8px;
      padding: 0 12px;
      background-color: #edebebff;
      font-size: 1rem;

      &:focus {
        outline: 1px solid #005eff9f;
      }

      &:hover {
        background-color: #f1f3f4; /* Sutil hover */
      }
    }

    &__button {
      width: 20%;
      max-width: 90px;
      height: 40px;
      border: none;
      border-radius: 8px;
      background-color: #005eff;
      color: white;

      &:hover {
        transform: translateY(-2px);
        filter: brightness(1.3);
        transition: 0.3s transform ease;
      }
    }

    &__title {
      text-align: center;
      margin-top: 20px;
    }
  }

  .MuiTableContainer-root {
    width: 90%;
    scrollbar-width: thin;
    scrollbar-color: #005eff transparent;
    -webkit-scrollbar-width: thin;
    -webkit-scrollbar-color: #005eff transparent;
  }

  .dashboard__table-head {
    th {
      color: white;
      background-color: #005eff;
    }
  }

  .TableContainer {
    margin-top: 20px;
    /* height: 200px; */
  }

  .MuiTableContainer-root {
    max-height: 80%;
  }

  .dashboard__logout {
    display: block;
    background-color: #f44336;
    color: white;
    width: 125px;
    padding: 10px;
    border-radius: 8px;
    border: none;

    &:hover {
      transform: translateY(-2px);
      filter: brightness(1.3);
      transition: 0.3s transform ease;
    }
  }

  @media screen and (max-height: 600px) {
    max-height: auto;
    height: auto;
    overflow: auto;

    .dashboard {
      max-height: auto;
      height: auto;
      overflow: auto;

      &__content-body {
        height: auto;
      }
    }

    .MuiTableContainer-root {
      max-height: auto;
      height: auto;
    }
  }

  @media screen and (max-width: 500px) {
    .dashboard {
      min-width: auto;
      width: 120%;
    }

    .MuiTableContainer-root {
      width: 100%;
      max-height: 70%;
      overflow-x: scroll;
      flex-direction: column;
    }
  }
`;
