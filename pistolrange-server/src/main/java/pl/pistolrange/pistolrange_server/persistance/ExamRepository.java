package pl.pistolrange.pistolrange_server.persistance;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import pl.pistolrange.pistolrange_server.domain.ExamEntity;

@Repository
public interface ExamRepository extends CrudRepository<ExamEntity, String> {
}
