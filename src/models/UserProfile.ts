import { User } from "./User"

export type UserProfile = User & {
    firstName: string
    lastName: string
}