package de.klem.shopping;

import lombok.Getter;
import lombok.Setter;
import org.springframework.hateoas.ResourceSupport;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

/**
 * Created by Yannic on 03.04.2015.
 */
@Getter
@Setter
@Entity
public class Article extends ResourceSupport {

    @Id
    @GeneratedValue
    private Long articleId;

    private String name;

    private Integer price;
}
