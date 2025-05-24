package pl.pistolrange.pistolrange_server.persistance;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.pistolrange.pistolrange_server.domain.QuestionEntity;
import pl.pistolrange.pistolrange_server.domain.WeaponLawCategory;

import java.util.List;

@Repository
public interface QuestionsRepository extends JpaRepository<QuestionEntity, Long> {

    List<QuestionEntity> findAllByCategory(WeaponLawCategory weaponLawCategory);
}
