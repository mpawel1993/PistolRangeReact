package pl.pistolrange.pistolrange_server.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.pistolrange.pistolrange_server.api.dto.QuestionDto;
import pl.pistolrange.pistolrange_server.domain.WeaponLawCategory;
import pl.pistolrange.pistolrange_server.mapper.QuestionMapper;
import pl.pistolrange.pistolrange_server.persistance.QuestionsRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LearnService {
    private final QuestionsRepository questionsRepository;
    private final QuestionMapper questionMapper;

    public List<QuestionDto> getQuestionByCategory(WeaponLawCategory weaponLawCategory) {
        return questionsRepository.findAllByCategory(weaponLawCategory).stream()
                .map(questionMapper::mapToDto)
                .toList();
    }
}
