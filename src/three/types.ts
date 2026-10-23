export interface SceneHandle {
  resize(width: number, height: number): void;
  setActive(active: boolean): void;
  dispose(): void;
}
