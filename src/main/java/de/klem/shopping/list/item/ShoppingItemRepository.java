package de.klem.shopping.list.item;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

/**
 * Created by Yannic on 03.04.2015.
 */
public interface ShoppingItemRepository extends CrudRepository<ShoppingItem, Long>{
}
