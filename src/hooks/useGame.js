import api from "../lib/api";
import { apiRoutes } from "../lib/constants/apiRoutes";
import { useAuthStorage } from "./useAuthStorage";

export function useGame(gameId) {
  const { authHeaders } = useAuthStorage();

  const createGame = async (gameData) => {
    return api.post(apiRoutes.createGame, gameData, authHeaders);
  };

  const joinGame = async (gameData) => {
    return api.post(apiRoutes.joinGame, gameData, authHeaders);
  };

  const getGameState = async () => {
    return api.get(apiRoutes.status(gameId), authHeaders);
  };

  const getTopCard = async () => {
    return api.get(apiRoutes.topCard(gameId), authHeaders);
  };

  const getPlayerCards = async () => {
    return api.get(apiRoutes.ownCard(gameId), authHeaders);
  };

  const nextTurn = async () => {
    return api.post(apiRoutes.nextTurn(gameId), {}, authHeaders);
  };

  const getCurrentPlayer = async () => {
    return api.get(apiRoutes.currentPlayer(gameId), authHeaders);
  };

  const playCard = async (cardId) => {
    return api.post(apiRoutes.playCard(gameId), { cardId }, authHeaders);
  };

  const drawCard = async () => {
    return api.post(apiRoutes.drawCard(gameId), {}, authHeaders);
  };

  const leaveGame = async () => {
    return api.post(apiRoutes.leaveGame(gameId), {}, authHeaders);
  };

  const startGame = async () => {
    return api.post(apiRoutes.startGame(gameId), {}, authHeaders);
  };

  const dealCards = async (dealData) => {
    return api.post(apiRoutes.dealCards, dealData, authHeaders);
  };

  return {
    createGame,
    joinGame,
    getGameState,
    getTopCard,
    getPlayerCards,
    nextTurn,
    playCard,
    drawCard,
    getCurrentPlayer,
    leaveGame,
    startGame,
    dealCards,
  };
}
