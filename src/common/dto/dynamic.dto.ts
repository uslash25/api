export function DynamicDto<T extends object>(cls: new () => T, data: T): T {
  const instance = new cls;

  Object.assign(instance, data);

  return instance;
}
