package pl.pistolrange.pistolrange_server.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.pistolrange.pistolrange_server.api.dto.QuestionDto;
import pl.pistolrange.pistolrange_server.domain.WeaponLawCategory;
import pl.pistolrange.pistolrange_server.mapper.QuestionMapper;
import pl.pistolrange.pistolrange_server.persistance.QuestionsRepository;

import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

@Service
@RequiredArgsConstructor
public class LearnService {
    private final QuestionsRepository questionsRepository;
    private final QuestionMapper questionMapper;

    public List<QuestionDto> getQuestionByCategory(WeaponLawCategory weaponLawCategory) {
        AtomicInteger counter = new AtomicInteger(1);
        return questionsRepository.findAllByCategory(weaponLawCategory).stream()
                .map(questionMapper::mapToDto)
                .peek(item -> item.setDisplayId(counter.getAndIncrement()))
                .toList();
    }
}
