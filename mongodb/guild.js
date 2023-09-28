import { Schema, model } from 'mongoose'

const guild = new Schema({
  
  guild: { type: String },
  ticket: { type: Array, default: [] }
  
             
});


export const db = model("Kaede-Guild", guild);