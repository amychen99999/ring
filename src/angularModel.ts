export type Member = {
    id: string
    account: string
    name?: string
    phone?: string
    email?: string
    fcmToken: string
    position: Position
}

export type Admin = {
    id: string
    account: string
    member: Member
    role: string
    chatCount?: ChatCount
    chatMember?: ChatMember[]
    chatMessages?: ChatMessage[]
    friends?: Member[]
}

export type ChatCount = {
    postCount: number
    sendCount: number
    receiveCount: number
}

export type ChatMessage = {
    id?: string
    postType?: string
    sender: string
    receiver?: string
    message: string
    timestamp?: number
}

export type ChatMember = {
    account: string
    name: string
    role: string
}

export type PostType = {
    id: string
    typeName: string
    title: string
    maxPerDay: number
    icon: string
    latestPost?: ChatMessage
}

export type Position = {
    lat: number
    lng: number
}