import type { Rubro } from "../../../models/Rubro";

const CategoryNode = ({
    node,
    selectedId,
    onSelect,
}: {
    node: Rubro;
    selectedId: number | null;
    onSelect: (id: number) => void;
}) => (
    <li>
        <span
            className={selectedId === node.id ? "category-nav active" : "category-nav"}
            onClick={() => onSelect(node.id)}
        >
            {node.denominacion}
        </span>

        {node.children?.length > 0 && (
            <ul className="category-children">
                {node.children?.map(child => (
                    <CategoryNode
                        key={child.id}
                        node={child}
                        selectedId={selectedId}
                        onSelect={onSelect}
                    />
                ))}
            </ul>
        )}
    </li>
);


export default CategoryNode;

