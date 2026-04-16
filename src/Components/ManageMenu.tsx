interface MenuProps {
  isVisible: boolean;
}

export function ManageMenu({ isVisible }: MenuProps) {
  return <>{isVisible && <div></div>}</>;
}
