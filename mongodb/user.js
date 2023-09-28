import { Schema, model } from 'mongoose'

const userset = new Schema({
  userID: { type: String },
  start: { type: Boolean, default: false },
  berries: { type: Number, default: 0 },
  status: { type: Number, default: 0 },

  pirata: {
    recompensa: { type: Number, default: 0 },
    bando: { type: String, default: "não-tem" },
    tripulação: { type: Array, default: [] }
  },

  marinha: {
    posicao: { type: Number, default: 0 }
  },

  força: { type: Number, default: 0 },
  velocidade: { type: Number, default: 0 },
  inteligência: { type: Number, default: 0 },
  akumaNoMi: { type: Number, default: 0 },
  navio: { type: Number, default: 0 }
  
             
});


export const db = model("OnePiece-Members", userset);