package pl.pistolrange.pistolrange_server.mapper;

import org.springframework.stereotype.Component;
import pl.pistolrange.pistolrange_server.api.dto.ExamDetailsDto;
import pl.pistolrange.pistolrange_server.domain.ExamEntity;

@Component
public class ExamMapper {

    public ExamDetailsDto toDto(ExamEntity examEntity){
        return ExamDetailsDto.builder()
                .examDuration(examEntity.getExamDuration())
                .goodAnswersToPass(examEntity.getGoodAnswersToPass())
                .answersCount(examEntity.getAnswersCount())
                .build();
    }
}
