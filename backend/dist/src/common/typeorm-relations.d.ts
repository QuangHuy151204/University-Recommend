export declare function relationById<T extends {
    id: number;
}>(id: number): Pick<T, 'id'>;
export declare function relationStub<T extends {
    id: number;
}>(id: number): T;
