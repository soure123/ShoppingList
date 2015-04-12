package de.klem.shopping.article;

import lombok.Getter;
import lombok.Setter;
import org.springframework.hateoas.ResourceSupport;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

/**
 * Created by Yannic on 03.04.2015.
 */
@Getter
@Setter
@Entity
public class Article {

    @Id
    @GeneratedValue
    private Long id;

    @Column(unique = true)
    private String name;

    private Integer price;
}
