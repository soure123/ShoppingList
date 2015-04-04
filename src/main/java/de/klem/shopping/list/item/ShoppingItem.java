package de.klem.shopping.list.item;

import de.klem.shopping.article.Article;
//import de.klem.shopping.list.ShoppingList;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.rest.core.annotation.RestResource;
import org.springframework.hateoas.ResourceSupport;

import javax.persistence.*;

/**
 * Created by Yannic on 03.04.2015.
 */
@Entity
@Getter
@Setter
public class ShoppingItem {
    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    @JoinColumn(name = "articleId", nullable = false)
    private Article article;

    private Integer number;

    private boolean bought;

    public ShoppingItem(){
        this.article = null;
        this.number = 0;
        this.bought = false;
    }

}
