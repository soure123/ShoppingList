package de.klem.shopping.list;

import de.klem.shopping.list.item.ShoppingItem;
import lombok.Getter;
import lombok.Setter;
import org.springframework.hateoas.ResourceSupport;

import javax.persistence.*;
import java.util.List;

/**
 * Created by Yannic on 03.04.2015.
 */
@Getter
@Setter
@Entity
public class ShoppingList extends ResourceSupport{

    @Id
    @GeneratedValue
    private Long listId;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "listId", referencedColumnName = "listId", nullable = false, unique = true)
    private List<ShoppingItem> items;
}
